/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
export default class PrimoPubSub {
    constructor() {
        this.topics = {};
        this.hOP = this.topics.hasOwnProperty;

        this.isReady = false;
        this.watcherId = this._watcher();                
    }

    _watcher() {
        let self = this;
        setTimeout(() => {
            try{
                Object.keys(this.restBaseURLs) ;
                if (Object.keys(this.restBaseURLs).length> 0) {
                    console.log('pubSub is ready to load interceptors');
                    self.isReady = true;
                    self.fireEvent('pubSubInterceptorsReady', {});
                } else {
                    this.watcherId = self._watcher();
                }
            } catch(e){
                console.log(e);
                this.watcherId = self._watcher();
            }
        }, 300);
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

            console.log('SUBSCRIBING to: "%s" with id "%s", topic has %d functions', topic, index, this.topics[topic].length)

            return {
                remove: function () {
                    this.topics[topic].splice(index, 1); //delete
                }
            }
        } catch (e) {
            console.error('subscribe: ', e.message);
        }
    }

    get listEvents() {
        try {
            return Object.keys(this.restBaseURLs).map(m => `${m}Event`);
        } catch (e) {
            console.error('events: ', e.message);
        }
    }

    get listBeforeTopics() {
        try {
            return Object.keys(this.restBaseURLs).map(m => `before-${m}`);
        } catch (e) {
            console.error('before-topics: ', e.message);
        }        
    }

    get listAfterTopics() {
        try {
            return Object.keys(this.restBaseURLs).map(m => `after-${m}`);
        } catch (e) {
            console.error('after-topics: ', e.message);
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

    delegateTopic(prefix, reqRes) {
        try {            
            let responseData = reqRes;
            let topicName = this.findTopicKeyByURLValue(reqRes.url || reqRes.config.url);            
            if (topicName) {                
                let delegateTopic = `${prefix}-${topicName}`;
                
                if (this.hOP.call(this.topics, delegateTopic)) {                    
                    this.topics[delegateTopic].forEach(subscription => {
                        let newReqRes = subscription(reqRes);
                        responseData = newReqRes != undefined ? newReqRes : reqRes
                    });
                }
            }
            return responseData;
        } catch (e) {
            console.error('delegateTopic: ', reqRes.url || reqRes.config.url, e.message);            
            return reqRes;
        }
    }

    fireEvent(url, data) {
        try {
            switch(url) {
                case 'pubSubInterceptorsReady':
                    let event = new CustomEvent(url, { detail: data, bubbles: true, cancelable: true, composed: false });
                    document.dispatchEvent(event);
                default:
                    let topicName = this.findTopicKeyByURLValue(url);
                    if (topicName) {
                        let eventName = `${topicName}Event`;
                        let event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true, composed: false });
                        document.dispatchEvent(event);
                    }        
            }


        } catch (e) {
            console.error('fireEvent: ',url,  e.message);
        }
    }
}    