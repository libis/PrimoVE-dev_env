class PrimoPubSub {
    constructor() {
        this.topics = {};
        this.hOP = this.topics.hasOwnProperty;
    }

    //* get all WebService base urls
    get restBaseURLs() {
        try {
            return angular.element(document.querySelector('primo-explore')).injector().get('restBaseURLs');
        } catch (e) {
            console.error('restBaseURLs: ', e.message);
            return {};
        }
    }

    //* subscribe to a topic a restBaseURL
    subscribe(topic, listener) {
        try {
            if (!this.hOP.call(this.topics, topic)) this.topics[topic] = []; //init
            let index = this.topics[topic].push(listener) - 1; //add

            return {
                remove: function () {
                    this.topics[topic].splice(index, 1); //delete
                }
            }
        } catch (e) {
            console.error('subscribe: ', e.message);
        }
    }

    get events() {
        try {
            return Object.keys(this.restBaseURLs).map(m => `${m}Event`);
        } catch (e) {
            console.error('events: ', e.message);
        }
    }

    //* determine topic by URL
    findTopicKeyByURLValue(v) {
        try {
            let urlV = new URL(v, window.location.origin);
            return Object.keys(this.restBaseURLs).find(k => this.restBaseURLs[k] === urlV.pathname)
        } catch (e) {
            console.error('findTopicKeyByURLValue: ', e.message)
            return undefined
        }

    }

    delegateTopic(prefix, url, headers, params, data) {
        try {
            let responseData = data;
            let topicName = this.findTopicKeyByURLValue(url);
            if (topicName) {
                let delegateTopic = `${prefix}-${topicName}`;
                if (this.hOP.call(this.topics, delegateTopic)) {
                    this.topics[delegateTopic].forEach(subscription => {                        
                        let newData = subscription(url, headers, params, data);
                        responseData = newData != undefined ? newData : data
                    });
                }
            }
            return responseData;
        } catch (e) {
            console.error('delegateTopic: ', e.message);
            return data;
        }
    }

    fireEvent(url, data) {
        try {
            let topicName = this.findTopicKeyByURLValue(url);
            if (topicName) {
                let eventName = `${topicName}Event`;
                let event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true, composed: false });
                document.dispatchEvent(event);
            }
        } catch (e) {
            console.error('fireEvent: ', e.message);
        }
    }
}

window.pubSub = new PrimoPubSub();

angular.module('httpRewrite', ['ng'])
    .config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push(['$q', ($q) => {
            return {
                'request': (request) => {                    
                    request = pubSub.delegateTopic('before', request.url, request.headers, request.params ,request);
                    return request
                },
                'requestError': (request) => {
                    //request.data = delegateTopic('beforeError', request.url, request);                                        
                    return $q.reject(request)
                },
                'responseError': (response) => {
                    //response.data = delegateTopic('afterError', response.config.url, response.data);
                    return $q.reject(response)
                },
                'response': (response) => {                    
                    response.data = pubSub.delegateTopic('after', response.config.url, response.config.headers, response.config.params, response.data);
                    pubSub.fireEvent(response.config.url, response.data);
                    return response
                }
            }
        }])
    }])
