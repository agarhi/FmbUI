const integrate = async (method, url, headers, body) => {
    const requestOptions = {
      method: method
    }

    if(headers!=null) {
      requestOptions.headers = headers
    }

    if(body!=null) {
      requestOptions.body = body
    }

    console.log(requestOptions)
    let resp
    try {
        resp = await fetch(url, requestOptions)
      } catch (error) {
        console.log('There was an error', error);
      }
      const response = await resp.json();
      console.log('response ',response)
      return response;

}

export default integrate;