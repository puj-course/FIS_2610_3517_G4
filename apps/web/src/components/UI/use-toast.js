import { useState, useEffect } from "react"

const TOAST_LIMIT = 1


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
}

