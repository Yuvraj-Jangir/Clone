// client/src/utils/dsa.js

/**
 * Quick Sort utility
 * Sorts an array based on the provided comparator function
 */
export function quickSort(arr, compare) {
    if (!arr || arr.length < 2) return arr.slice();
    const array = arr.slice(); // avoid mutating original
    function partition(low, high) {
        const pivot = array[high];
        let i = low;
        for (let j = low; j < high; j++) {
            if (compare(array[j], pivot) < 0) {
                [array[i], array[j]] = [array[j], array[i]];
                i++;
            }
        }
        [array[i], array[high]] = [array[high], array[i]];
        return i;
    }

    function sort(low, high) {
        if (low < high) {
            const p = partition(low, high);
            sort(low, p - 1);
            sort(p + 1, high);
        }
    }
    sort(0, array.length - 1);
    return array;
}

/**
 * Trie implementation for search suggestions
 */
export class TrieNode {
    constructor() {
        this.children = {};
        this.endOfWord = false;
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.endOfWord = true;
    }

    suggest(prefix, limit = 5) {
        const results = [];
        let node = this.root;
        for (let char of prefix.toLowerCase()) {
            if (!node.children[char]) return results;
            node = node.children[char];
        }

        function dfs(currentNode, path) {
            if (results.length >= limit) return;
            if (currentNode.endOfWord) results.push(path);
            for (let c in currentNode.children) {
                dfs(currentNode.children[c], path + c);
            }
        }
        dfs(node, prefix);
        return results;
    }
}

/**
 * Debounce utility
 * Delays function execution until after wait time has passed
 */
export function debounce(fn, delay = 100) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}