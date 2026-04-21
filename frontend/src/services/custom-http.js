import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {

        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-access-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);



        if (response.status < 200 || response.status >= 310) {//поменять 310 на 300
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null;
                }
            }

            const resp = await response.json();//создал переменную, т.к. как показывал Роман - не работает
            throw new Error(resp.message);
            // throw new Error(response.message); //Так у Романа, но у меня так не работает

        }

        return await response.json();


    }
}