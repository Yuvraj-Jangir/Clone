export function quickSort(arr, cmp = (a, b) => a - b) {
    if (!Array.isArray(arr) || arr.length < 2) return arr ? arr.slice() : [];
    const a = arr.slice();

    function qs(l, r) {
        if (l >= r) return;
        const p = a[Math.floor((l + r) / 2)];
        let i = l,
            j = r;
        while (i <= j) {
            while (cmp(a[i], p) < 0) i++;
            while (cmp(a[j], p) > 0) j--;
            if (i <= j) {
                [a[i], a[j]] = [a[j], a[i]];
                i++;
                j--;
            }
        }
        if (l < j) qs(l, j);
        if (i < r) qs(i, r);
    }
    qs(0, a.length - 1);
    return a;
}
export function binarySearch(
    a,
    x,
    cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
) {
    let l = 0,
        r = a.length - 1;
    while (l <= r) {
        const m = (l + r) >> 1;
        const c = cmp(a[m], x);
        if (c === 0) return m;
        if (c < 0) l = m + 1;
        else r = m - 1;
    }
    return -1;
}