function generateKey(text) {
    // تولید کلید واژه بر اساس متن (برای نوآوری)
    let keySum = 0;
    for (let i = 0; i < text.length; i++) {
        keySum += text.charCodeAt(i);
    }
    const randomPart = Math.random().toString(36).slice(2, 6); // بخش تصادفی
    return `MH${keySum % 1000}${randomPart}`; // کلید منحصربه‌فرد
}

function mhOneEncrypt(text, key) {
    if (!text || !key) return null;
    let keySum = 0;
    for (let i = 0; i < key.length; i++) {
        keySum += key.charCodeAt(i); // مجموع ASCII کلید
    }
    let result = '';
    // مرحله 1: جابه‌جایی کاراکترها
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i) + (keySum % 50); // جابه‌جایی
        result += String.fromCharCode(charCode % 256);
    }
    // مرحله 2: معکوس‌سازی بخشی از متن
    const reversePoint = key.length % result.length;
    result = result.slice(reversePoint) + result.slice(0, reversePoint);
    // مرحله 3: تبدیل به رشته عددی برای رمزنگاری
    let encoded = '';
    for (let i = 0; i < result.length; i++) {
        encoded += result.charCodeAt(i).toString(16).padStart(2, '0'); // به هگز
    }
    return encoded;
}

function mhOneDecrypt(encoded, key) {
    if (!encoded || !key) return null;
    let keySum = 0;
    for (let i = 0; i < key.length; i++) {
        keySum += key.charCodeAt(i);
    }
    // مرحله 1: تبدیل از هگز به متن
    let result = '';
    for (let i = 0; i < encoded.length; i += 2) {
        result += String.fromCharCode(parseInt(encoded.slice(i, i + 2), 16));
    }
    // مرحله 2: معکوس‌سازی معکوس
    const reversePoint = key.length % result.length;
    result = result.slice(-reversePoint) + result.slice(0, -reversePoint);
    // مرحله 3: بازگرداندن جابه‌جایی
    let decrypted = '';
    for (let i = 0; i < result.length; i++) {
        let charCode = (result.charCodeAt(i) - (keySum % 50) + 256) % 256;
        decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
}

function encryptText() {
    const text = document.getElementById("textInput").value;
    let key = document.getElementById("keyInput").value;
    if (!text) {
        document.getElementById("output").textContent = "Please enter text!";
        return;
    }
    if (!key) {
        key = generateKey(text); // تولید کلید اگر کاربر وارد نکرده باشد
        document.getElementById("keyInput").value = key;
    }
    const encrypted = mhOneEncrypt(text, key);
    if (encrypted) {
        document.getElementById("output").textContent = `Encrypted: ${encrypted}`;
        document.getElementById("generatedKey").textContent = `Your key: ${key} | Keep it safe! | By 0xbahari`;
    } else {
        document.getElementById("output").textContent = "Encryption failed!";
    }
}

function decryptText() {
    const encrypted = document.getElementById("textInput").value;
    const key = document.getElementById("keyInput").value;
    if (!encrypted || !key) {
        document.getElementById("output").textContent = "Please enter encrypted text and key!";
        return;
    }
    const decrypted = mhOneDecrypt(encrypted, key);
    if (decrypted) {
        document.getElementById("output").textContent = `Decrypted: ${decrypted} | By 0xbahari`;
    } else {
        document.getElementById("output").textContent = "Invalid key or text!";
    }
}
