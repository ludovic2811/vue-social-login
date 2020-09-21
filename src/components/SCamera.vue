<template>
     <div class="modal is-active">
      <div class="modal-background" ></div>
		<div class="modal-card"  style="width:90%">
            <header class="modal-card-head">
			  <p class="modal-card-title">Immatriculation</p>
			   		  <div style="float:rigth" >
				      	<s-button theme="" label="" icon="times-circle" @onclick="close"/>
				      </div>
			</header>
            <section class="modal-card-body">
                <div style="height:400px" class="notification is-danger" v-show="error">
                    <button class="delete" v-on:click="error=false"></button>
                    {{errDescription}}
                </div>
                <div style="height:400px"  v-show="!error">
                     <div class="control has-icons-left" style="margin-bottom: 10px">
                        <div class="select is-medium is-rounded is-success">
                            <select v-model="choiceDevice" v-on:change='getStream' >
                            
                                <option v-for="deviceItem in readDevices" 
                                    v-if="deviceItem.kind=='videoinput'"
                                    :value="deviceItem.deviceId">
                                        {{deviceItem.label}}
                                </option>
                            </select>
                            <span class="icon is-small is-left">
                                <i class="fas fa-video"></i>
                            </span>
                        </div>
                    </div>
                    <div v-show="this.photoCapture">
                        <canvas id="canvas"  width="300" />
                    </div>
                    <div v-show="!this.photoCapture" style="width:300px">
                    <video  ref="video" 
                            
                            class="videostream" autoplay muted playsinline 
                            ></video>
                    </div>
                    <div style="height:400px" class="notification is-warning"
                         v-show="errorNumero">
                        <button class="delete" v-on:click="errorNumero=false"></button>
                        Numéro d'Immatriculation non détecté !<br/>
                        Veuillez recommencer ...
                     </div>
                      <div style="height:400px" class="notification is-warning"
                         v-show="errorImage">
                        <button class="delete" v-on:click="errorImage=false"></button>
                        Problème de reconnaissance d'image ...
                     </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <div v-show="!detection" style="width:100%">
                    <div style="width:100%;text-align:center"  v-show="!this.photoCapture">
                        <s-button  theme="is-primary is-larger" icon="camera" @onclick="capture" label="Photo" ></s-button>
                    </div>
                    <div style="width:100%;text-align:center" v-show="this.photoCapture">
                        <div class="photoCorrect">
                            La photo vous semble correcte ?
                        </div>
                        <div>
                        <div style="float:left">
                            <s-button  theme="is-warning is-larger" icon="thumbs-down" @onclick="refresh" label="Non" ></s-button>
                        </div>
                        <div style="float:right">
                            <s-button theme="is-success is-larger" icon="thumbs-up" @onclick="confirmPhoto" label="Oui" ></s-button>
                        </div>
                        </div>
                    </div>
                </div>
                <div v-show="detection" style="width:100%">
                    <button style="width:100%" class="button is-success is-loading" disabled >Détection de la plaque</button>
                </div>
			</footer>

		</div>
     </div>
</template>
<script >
import ocr from '@/firebase/searchByNumero_api'
export default {
    data() {
        return {
            choiceDevice: "",
            readDevices: [],
            photoCapture: false,
            image64: "",
            error: false,
            errDescription: "Erreur inconnue",
            errorImage: false,
            errorNumero: false,
            detection: false
        }
    },
   
    methods: {
        confirmPhoto() {
            var splitImage = this.image64.split(",")
            if (splitImage.length==0)
                this.errorImage = true;
            else {
                 this.errorImage = false;
                this.detection = true;
                ocr.api.ocr(splitImage[1],numero=>{
                    this.detection = false;
                    if (numero != '') {
                         this.stopvideo();
                         this.errorNumero = false;
                         this.$emit("captureNumero", numero);
                    }
                    else {
                         this.errorNumero = true;
                         this.photoCapture=false
                    }
                      
                })
            }
        },
        refresh() {
            this.photoCapture=false
        },
        capture() {
            const mediaStreamTrack = this.$refs["video"].srcObject.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            imageCapture.grabFrame()
                .then(imageBitmap => {
                    const canvas = document.querySelector('canvas');
                    canvas.height = canvas.width * (imageBitmap.height / imageBitmap.width);
                    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, canvas.width, canvas.height );
                    this.photoCapture = true;
                    this.image64 = canvas.toDataURL();
                })
        },
        close() {
            this.stopvideo();
           
            this.$emit("close");
        },
        stopvideo(){
            window.stream.getTracks().forEach(function(track) {
                track.stop();
            });
             this.$refs["video"].src = "";
        },
        getStream() {
           
            if (window.stream) {
                window.stream.getTracks().forEach(function(track) {
                track.stop();
                });
            }
            
            if (this.choiceDevice=="") {
                this.error = true;
                this.errDescription = "Aucune caméra n'est disponible";
            }
            else {
                this.error = false;
                this.errDescription = "";
            }
                
           
            if (!this.error) {
                const constraints = {
                    video: {
                    deviceId: {exact: this.choiceDevice}
                    }
                };                
                navigator.mediaDevices.getUserMedia(constraints).
                    then(stream=>{
                        window.stream = stream;
                        this.$refs["video"].srcObject = stream;
                    }).catch(this.handleError);
            }
        },
        handleError(err) {
            this.error = true;
            this.errDescription = "Caméra détecté mais problème de lecture:<br/>"+err;
        }
    },
    mounted() {
        
        navigator.mediaDevices.enumerateDevices().then(devices=>{
            this.readDevices = devices;
            var deviceFindVideo = this.readDevices.find(elt=>elt.kind==="videoinput");
            this.choiceDevice = deviceFindVideo.deviceId;
            this.getStream();
        }).catch(err=>{
            this.error = true;
            this.errDescription = "Impossible de détecter les caméras:<br/>"+err;
        })
    }
}
</script>
<style scoped>
video.videostream {
    width: 100%;
    max-width: 720px;
}
.#canvas {
  
  width: 100% !important;
  height: 100% !important;
}
.photoCorrect {
    color: black;
    width: 100%;
    font-weight: bold;
    margin-bottom: 5px;
}
</style>