export const launchCameraAsync = (navigator) => {
    return new Promise((resolve) => {
        navigator.navigate("Camera", {
            onPhotoTaken: (result) => resolve({cancelled:false, ...result}),
            onCancel: () => resolve({cancelled:true})
        });
    });
};
