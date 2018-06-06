var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8000;

var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "votingpool",
  "private_key_id": "ae264ddc5d847865395238603bfaebd584b7210e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSP+HzkA6lnLaj\nHB60dieBtTCACLzkbUAxYLJv0zPncFJKVdcvS5A7owyMToZ9Bv77o7b5nrCllgCX\nPDS5VG62hWQ/d4JSxji1jLEEyy7aX0il90L9bO8lsHPVKJoLMiy9nUUVGylRtluB\nEMGFjp/7EA+PyTU2Wqvdbs0+laS0aRJaYiHHdFQPSzrWMvfxmUf5YdFK2E+O6ExX\nm7FHWv04PcM0uWCEkj8UdYk7B4OJ+9LWlNV1RDAwibXpqYctqEIkIgTgmG5wkq+b\n6Qe0sNVzG0Te5qt9zjW5AhG3gsggHMCtf00aT96UJSIGA4qBOnyIBKojBZCl5KxX\nzzJ13iEFAgMBAAECggEAD8gU+dNxwS1ICBHgvliBqt2Cfk5zE7M2Wh21I5wG3dKh\nDqR0tAXTapwNnpZarOM0YLMp64XUSgoFxkwY5GbYC5oZVz/uMEBzniOwdnP2eloN\n3Nrxv6chp0+DMF1RQiQH7+4opj5oFwk2lpbYSzE40j7JbxqnQ1ZFdX+fZkF/pHgI\nWnENUWpRx5oudHhrxrOrNoKX8LXCtZo0koEI2fedGsD3Dyn2aEPewL4EqEXpLwvE\nvy0leB2W8MdADplv1o3oT68PHZUvp8CiOuDFTzVKTgRBuj/PaMyH00h31JXI01RK\nUh6oOvOBrUUuYufJqVO5WU4zcup2OXVHh/XsCRiHgQKBgQDIFOf//+U0hV9ZwMjU\nSA3FArhgDINPgeJ5GPcbHMW1AqcOHsmvAVrduPuJK+4/LEMJ5Hwvk7lfZCDh9Uyo\npqzsZbmnRHJQkuMqkf2pM6MSC1ANtVVka0dBBX6IMPodqVOkBZqdvka06tuvFMZr\nwa1NuTU4U543oX5yTdJ7gwYHhwKBgQC7H31TgAr0B8A4luc8BRONBTiOqZCIU8uJ\nzqg61gFVceTU76xOZCXALUIz9Tti4i0QXlXfm+3j+H46QjWKi7JmDFS3gVnDn7PK\ntBdhZptRw++2oyQKhoLhBAKORAOMBDYVeTvEcQpxc8DrHsVaXS9CB0wWQih2/jDn\n5QLw5xheEwKBgQC+Ft6z4TKpy2zjoL0ssagjXIo+9qRqjUPVOVrLb3KGnpaIW8fR\ndMAXlv+jOxGHA05Nv74clYSwlDiJdLv4HyJ7FcpkmCrjUipw73LHpj9vjT/pRjZy\nyVlQ9R9Z1O5L7+t/EbPr2jLi/57noB1DkyZLiYJ+mTLgN5Yikr0+iyTXUQKBgHuN\n4kmlLRZOm9yBv3MBAxTFUr/YNIfflHCM1MXsknrhti/nhUVJmSeYerMmBK1ZHFpH\nf7ojEmPJq0c6enHdpdD96V41eZjStXttiFaW0o2dq4VTmTOd94MuC6X2QMVN7owl\nPZKK9VNOFB7rdXIiP1cAzHuR+XgAhThJHbUFUjCjAoGAcACdhyRELF7jdKk70p+2\n/qNvjd89LQ5yisxfqi5wRLJ1udRtHWzk5HADNn5cvam1XQ1ZwuOZvo0XjaxUTwl+\nxM7luHH5EpsvZ71RjbiVGIO6+n6hRD19qAvSDv13goP5mmOfD8zp7rMzcdmWUIY5\nugAJI/zBlRapR/NxLUKXNYI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-cw4ho@votingpool.iam.gserviceaccount.com",
  "client_id": "114163308241940718402",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cw4ho%40votingpool.iam.gserviceaccount.com"
}),
  databaseURL: 'https://votingpool.firebaseio.com'
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var candidates = db.ref("candidates");
var ips = db.ref("ips");

app.use('/semantic', express.static('public/semantic/dist'));
app.use('/img', express.static('public/img'));

// BEGIN ROUTES 

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
		console.log("Sending index.html");
});

app.get('/candidates', function(req, res, next) {
		console.log("Route : /candidates");
    candidates.once("value", function(snapshot) {
        res.json(snapshot.val());
    });  
});

app.get('/checkip/:ip', function(req, res, next) {
	console.log("Route : /checkip/:ip");
	var result = null;
    ips.once("value", function(snapshot) {
			snapshot.forEach(function(ref) {
				console.log(ref.val().ip);
				if(ref.val().ip == req.params.ip) result = ref.val().date;
			});
     	res.send(result);
    });  
});

app.get('/setip/:ip', function(req, res, next) {
	console.log("Route : /setip/:ip");
	var date = new Date().toLocaleString();
    ips.push().set({
			ip: req.params.ip,
			date: date
		});
	res.send(date);
});

// END ROUTES
console.warn("INFO: Serving Voting Pool Application on port: "+port);

app.listen(port);
