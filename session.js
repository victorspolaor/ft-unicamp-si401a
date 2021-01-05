let xml = new XMLHttpRequest();
xml.onreadystatechange = function () {
    if (xml.readyState === 4) {
        switch (xml.status) {
            case 401:
                location.replace("login.html");
                break;
        }
    }
};

xml.open("POST", "session.php", false);
xml.send();