new Vue({
    el: '#app',
  
    data() {
      return {
        isCameraOpen: false,
        isPhotoTaken: false,
        isShotPhoto: false,
        isLoading: false,
        link: '#' };
  
    },
  
    methods: {
      toggleCamera() {
        if (this.isCameraOpen) {
          this.isCameraOpen = false;
          this.isPhotoTaken = false;
          this.isShotPhoto = false;
          this.stopCameraStream();
        } else {
          this.isCameraOpen = true;
          this.createCameraElement();
        }
      },
  
      createCameraElement() {
        this.isLoading = true;
  
        const constraints = window.constraints = {
          audio: false,
          video: true };
  
  
  
        navigator.mediaDevices.
        getUserMedia(constraints).
        then(stream => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        }).
        catch(error => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
      },
  
      stopCameraStream() {
        let tracks = this.$refs.camera.srcObject.getTracks();
  
        tracks.forEach(track => {
          track.stop();
        });
      },
  
      takePhoto() {
        if (!this.isPhotoTaken) {
          this.isShotPhoto = true;
  
          const FLASH_TIMEOUT = 50;
  
          setTimeout(() => {
            this.isShotPhoto = false;
          }, FLASH_TIMEOUT);
        }
  
        this.isPhotoTaken = !this.isPhotoTaken;
  
        const context = this.$refs.canvas.getContext('2d');
        context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);

        this.predictCategory();
      },
      
      predictCategory() {
        // POST request using fetch with set headers
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer my-token',
            'My-Custom-Header': 'foobar'
          },
          body: JSON.stringify({ data: [ 
            //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oMCRUiMrIBQVkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADElEQVQI12NgoC4AAABQAAEiE+h1AAAAAElFTkSuQmCC",
              document.getElementById("photoTaken").toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream")
            ] })
        };
        fetch('https://hf.space/embed/jph00/testing/+/api/predict/', requestOptions)
          .then(response => response.json())
          .then(data => 
            this.presentData(data)
          );
      },

      presentData(data) {
        const predictions = document.getElementById("predictions");
        predictions.innerHTML = "It is a " + data.data[0].label;
        console.log(data);
      },
   } 
});