interface VariableProps {
    variables: Object;
    setVariables: Function;
    name: string;
    id: number;
    url: string;
    setUrl: Function;
    requestBody: string;
    setRequestBody: Function;
    currentVarIdx: number;
    setCurrentVarIdx: Function;
}

import "./Variable.scss"

const Variable = (props: VariableProps) => {
    return (
        <tr key={`V${props.id}`}>
            <td key={`V0${props.id}`} className="tdI">
                <input type="text" name={`variable${props.id}`} id={`variable${props.id}`} defaultValue={props.name} onChange = {
                    (e) => {
                        const newVariables = props.variables as any;
                        const oldName = props.name;
                        let newName = e.target.value;
                        const value = newVariables[oldName];
                        delete newVariables[oldName];
                        newVariables[newName] = value;
                        props.setVariables({...newVariables});
                        props.setUrl(props.url.replace(`{{${oldName}}}`, `{{${newName}}}`));
                        props.setRequestBody(props.requestBody.replace(`{{${oldName}}}`, `{{${newName}}}`));
                    }
                }/>
            </td>
            <td key={`V1${props.id}`} className="tdI">
                <input type="text" name={props.name} id={props.name} defaultValue={(props.variables as any)[props.name]} onChange = {
                    (e) => {
                        const newVariables = props.variables as any;
                        newVariables[props.name] = e.target.value;
                        props.setVariables({...newVariables});
                    }
                }/>
            </td>
            <td key={`V2${props.id}`} className="tdB">
                <button onClick={() => {
                    const newVariables = props.variables as any;
                    delete newVariables[props.name];
                    props.setVariables({...newVariables});
                }}>
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default Variable;