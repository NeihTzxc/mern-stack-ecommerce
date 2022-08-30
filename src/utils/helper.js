exports.getDeviceFromHeasers = (headers) => {
    let device = {
        'device_id': headers['X-DEVICE-ID'] || headers['x-device-id'],
        'os_type': headers['X-OS-TYPE'] || headers['x-os-type'],
        'os_version': headers['X-OS-VERSION'] || headers['x-os-version'],
        'app_version': headers['X-APP-VERSION'] || headers['x-app-version'],
        'device_name': headers['X-DEVICE-NAME'] || headers['x-device-name'] || "",
        'push_token': headers['X-PUSH-TOKEN'] || headers['x-push-token'] || ""
    }

    if (device.device_id && device.os_type && device.os_version && device.app_version) {
        return device
    } else {
        console.error("Wrong header!", headers)
        return null
    }
}
exports.makeID = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}