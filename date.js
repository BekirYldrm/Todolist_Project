exports.getDate = getDate ; // getDate fonksiyonunu dışa aktarıyoruz ama fonksiyonu çağırmadık ,()  eklemedik.

function getDate () {

    const today = new Date();  // sunucunun çalıştığı zamanı  today değişkenine atadık.

    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }

    return today.toLocaleDateString("en-US", options);  //today degiskenindeki tarihi options nesnesine göre biçimlendiriyor.
}

exports.getDay = function () { // isimsiz fonksiyon oluşturup dogrudan module atayabiliriz .
    
    const today = new Date(); 

    const options = { weekday: "long" }

    return today.toLocaleDateString("en-US", options); 
}
