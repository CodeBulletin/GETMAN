import './Window.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Variable from './Variable/Variable';
import MonacoEditor from 'react-monaco-editor';

// Testing API: https://catfact.ninja/fact

const Window = () => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    const [method, setMethod] = useState(methods[0]);
    const [url, setUrl] = useState('');
    const [response, setResponse] = useState('');
    const [responseHeaders, setResponseHeaders] = useState('');
    const [dataSize, setDataSize] = useState(0);
    const [headerSize, setHeaderSize] = useState(0);
    const [responseTime, setResponseTime] = useState(0);
    const [responseStatus, setResponseStatus] = useState(0);
    const [responseCode, setResponseCode] = useState('');
    const [variables, setVariables] = useState({});
    const [currentVarIdx, setCurrentVarIdx] = useState(0);
    const [requestBody, setRequestBody] = useState('');
    // const [windowID , setWindowID] = useState(0);

    useEffect(() => {
        const url_element = document.getElementById('url') as HTMLInputElement;
        if (url) {
            url_element.value = url;
        }
    }, [url]);


    const sendRequest = async () => {
        if (url === '') {
            return;
        }

        //Replace variables with their values in the url

        let newUrl = url;
        let newRequestBody = requestBody;

        Object.keys(variables).forEach((key) => {
            newUrl = newUrl.replace(`{{${key}}}`, (variables as any)[key]);
            newRequestBody = newRequestBody.replace(`{{${key}}}`, (variables as any)[key]);
        });

        axios.interceptors.request.use( (req: any) => {
            req.meta = req.meta || {}
            req.meta.requestStartedAt = new Date().getTime();
            return req;
        });

        axios.interceptors.response.use( (res: any) => {
            setResponseTime(new Date().getTime() - res.config.meta.requestStartedAt);
            return res;
        },
        res => {
            setResponseTime(new Date().getTime() - res.config.meta.requestStartedAt);
            throw res;
        });

        let request: Object;

        if (method === 'GET') {
            request = {
                method: method,
                url: newUrl
            }
        } else {
            request = {
                method: method,
                url: newUrl,
            }

            if (requestBody && request !== null) {
                let json = JSON.parse(requestBody);

                Object.keys(json).forEach((key) => {
                    (request as any)[key] = json[key];
                })
            }
        }

        axios(request).then((response) => {
            const data = response.data ? response.data : response;
            const headers = response.headers;

            const size = JSON.stringify(data).length;
            setDataSize(size);

            const headerSize = JSON.stringify(headers).length;
            setHeaderSize(headerSize);

            const pretty = JSON.stringify(data, null, 2);
            const formated = pretty.replace(/\\n/g, '\n');
            setResponse(formated);

            const prettyHeaders = JSON.stringify(headers, null, 2);
            const formatedHeaders = prettyHeaders.replace(/\\n/g, '\n');
            setResponseHeaders(formatedHeaders);

            setResponseStatus(data.status);
            setResponseCode(data["code"]);

        }).catch((error) => {
            const data = error.message;
            setDataSize(data.length);

            const headers = error.response.headers;
            const headerSize = JSON.stringify(headers).length;
            setHeaderSize(headerSize);

            const pretty = JSON.stringify(data, null, 2);
            setResponse(pretty);

            const prettyHeaders = JSON.stringify(headers, null, 2);
            const formatedHeaders = prettyHeaders.replace(/\\n/g, '\n');
            setResponseHeaders(formatedHeaders);

            const status = error.response.status;
            setResponseStatus(status);
            setResponseCode(error["code"]);
        });
    }

    const addVariables = () => {
        const string = url;
        const regex = /{{([^{}]+)}}/g;
        const matches = (string.match(regex) ?? []).map(match => match.slice(2, -2));

        const newVariables = variables as any;
        matches.forEach((match) => {
            if (!newVariables[match]) {
                newVariables[match] = `{{${match}}}`;
            }
        });

        setVariables({...newVariables});
    }

    const options = {
        minimap: { enabled: false },
        automaticLayout: true,
        scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
        },
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        contextmenu: true,
        autoIndent: 'full',
        wordWrap: 'on',
    };

    return (
        <div className="MainWindow">
            <div className="urlinput">
                <select name="method" id="method" onChange={(e) => setMethod(e.target.value)}>
                    {methods.map((method, index) => {
                        return <option key={index}>{method}</option>
                    })}
                </select>
                <input type="text" name="url" id="url" 
                    onChange={(e) => {
                        setUrl(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            addVariables();
                            return;
                        }
                        if (e.key === 'Enter') {
                            sendRequest();
                        }
                    }}
                    placeholder='Enter URL'/>
                <button onClick={sendRequest}>
                    Send
                </button>
            </div>

            {
                method === 'GET' ? null : 
                <div className='requestbody'>
                    <span className='head'>Request Body</span>
                    <MonacoEditor
                        height="12rem"
                        value={requestBody}
                        options={options as any}
                        onChange={(value) => {
                            setRequestBody(value);
                        }}
                    />
                </div>
            }

            <div className='Variables'>
                <table cellPadding={0} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th id="VH1">
                                <input type="text" name="variable" id="variable" value={"Variables"} placeholder='Enter Variable Name' readOnly/>
                            </th>
                            <th id="VH2">
                                <input type="text" name="variable" id="variable" value={"Values"} placeholder='Enter Variable Name' readOnly/>
                            </th>
                            <th id="VH3">
                                <button onClick={
                                    () => {
                                        const newVariables = variables as any;
                                        newVariables[`variable${currentVarIdx}`] = ``;
                                        setVariables({...newVariables});
                                        setCurrentVarIdx(currentVarIdx + 1);
                                    }
                                }>
                                    Add
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(variables).map((key, index) => {
                                return <Variable 
                                    key={index} 
                                    id={index} 
                                    name={key} 
                                    variables={variables} 
                                    setVariables={setVariables} 
                                    url={url} setUrl={setUrl}
                                    requestBody={requestBody} setRequestBody={setRequestBody}
                                    currentVarIdx={currentVarIdx} setCurrentVarIdx={setCurrentVarIdx}
                                />
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className='responsedata'>
                <div className='details'>
                    <span>Response Headers</span>
                    <span>Header Size: {headerSize} bytes</span>
                    <span>Response Time: {responseTime} </span>
                    <span>Response Status: {responseStatus} </span>
                </div>
                <SyntaxHighlighter language="json" style={docco} lineProps={{style: {whiteSpace: 'pre-wrap'}}} wrapLines={true} showLineNumbers={true}>
                    {responseHeaders}
                </SyntaxHighlighter>
            </div>

            <div className='responsedata'>
                <div className='details'>
                    <span>Response Data</span>
                    <span>Size: {dataSize} bytes</span>
                    {
                        responseCode ? <span>Response Code: {responseCode} </span> : null
                    }
                </div>
                <SyntaxHighlighter language="json" style={docco} lineProps={{style: {whiteSpace: 'pre-wrap'}}} wrapLines={true} showLineNumbers={true}>
                    {response}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export default Window