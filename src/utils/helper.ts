function convertToBase62(num: bigint): string {
    const charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let base62 = "";

    while (num > 0n) {
        base62 = charset[Number(num % 62n)] + base62;
        num /= 62n;
    }

    return base62 || "0";
}

export { convertToBase62 };
