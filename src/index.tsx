import React from "react"
import dotenv from "dotenv"
dotenv.config()
import * as ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { ApolloProvider, ApolloClient, InMemoryCache, concat } from "@apollo/client"
import { createUploadLink } from "apollo-upload-client"
import { setContext } from "@apollo/client/link/context"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"

window.app = {
    BASE_URL: process.env.NODE_ENV === "production" ? "https://news-admin.dadsnetwork.co" : "http://localhost:3000",
    REACT_APP_API: process.env.NODE_ENV === "production" ? "https://news-api.dadsnetwork.co/gql/v1" : "http://localhost:5005/gql/v1",
}

// Create Apllo Client
const mainLink = createUploadLink({
    uri: window.app.REACT_APP_API,
    headers: {
        "x-apollo-operation-name": "",
    },
}) // HTTP + Upload uri
const authMiddleware = setContext((_, { headers }) => {
    const accessToken = localStorage.getItem("accessToken")
    return {
        headers: {
            ...headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
    }
})

const client = new ApolloClient({
    link: concat(authMiddleware, mainLink),
    cache: new InMemoryCache(),
})

const container = document.getElementById("root")
if (!container) throw new Error("Failed to find the root element")
ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <Router>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </Router>
    </React.StrictMode>
)
serviceWorker.unregister()
reportWebVitals()
