const integrate = async (method, url, headers, body) => {
    const requestOptions = {
      method: method,
      credentials: 'include',
      withCredentials: true
    }

    if(headers!=null) {
      requestOptions.headers = headers
    }

    if(body!=null) {
      requestOptions.body = body
    }

    console.log('Executing '+ method + ' ' + url)
    let resp
    try {
        resp = await fetch(url, requestOptions)
      } catch (error) {
        console.log('There was an error', error);
      }
      const response = await resp.json();
      console.log('response ',resp.headers.get("Set-Cookie"))
      resp.headers.forEach(console.log);
      return response;

}

export default integrate;