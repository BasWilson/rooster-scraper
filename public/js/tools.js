class ExpressRequest {
    constructor(url, data, callback) {
        this.url = url;
        this.data = data;
        this.callback = callback;
        this.send()
    }

    send() {
        var expReq = this;
        var formData = new FormData();
        formData.append("submitData", JSON.stringify(this.data));

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (typeof this.responseText == 'undefined') return false;

            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                expReq.callback(response);
            }

        };

        xhttp.open("POST", this.url, true);
        xhttp.send(formData);
    }
}
