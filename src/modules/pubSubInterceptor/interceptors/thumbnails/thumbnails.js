pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    if (Object.keys(reqRes.config.params).includes('blendFacetsSeparately')) {
        reqRes.data.docs.map((m) => {
            try {
                if (m.adaptor === 'SearchWebhook') {                    
                    m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;
                    m.pnx.links.thumbnail.forEach((url, i) => {
                        if (/^\$\$U/.test(url)) {
                            url = url.replace(/^\$\$U/, '')
                            m.delivery.link.push({
                                "@id": `_:${i}`,
                                "linkType": "http://purl.org/pnx/linkType/thumbnail",
                                "linkURL": url,
                                "displayLabel": "thumbnail"
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`No thumbnail for record:${m.pnx.control.recordid}`);
            }
        });
        debugger;
    }
    return reqRes
});