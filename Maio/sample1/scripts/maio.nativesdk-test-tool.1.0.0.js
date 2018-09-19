Maio._nativeApi = (method, jsonArgs, callback) => {
    switch (method) {
        case "loadAdInfo":
            callback({
                device: {
                    plt: "ios",
                    sdkv: "1.3.0",
                },
                conversionItems: {},
                baseLogItems: {},
                settings: {},
                isDefaultMute: false,
                allowed_skip: false,
                skippable_after_sec: 3,
            });
            break;

        default:
            console.log(method);
            console.log(jsonArgs);
            break;
    }
};

