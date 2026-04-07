import { useState, useEffect } from "react"

const TOAST_LIMIT = 1

let count = 0
function generateId() {
	count = (count + 1) % Number.MAX_VALUE
	return count.toString()
}

const toastStore = {
    state: {
        toasts: [],
    },
    listeners: [],

	getState: () => toastStore.state,
	setState: (nextState) => {
    if (typeof nextState === 'function') {
        toastStore.state = nextState(toastStore.state)
    } else {
        toastStore.state = { ...toastStore.state, ...nextState }
    }

    toastStore.listeners.forEach(listener => listener(toastStore.state))
},
subscribe: (listener) => {
    toastStore.listeners.push(listener)
    return () => {
        toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
}

}

