export default function Greeting(props){
    return <h2>Hello, {props.name}!</h2>;
}

export function TaskStatus({ isDone, name }){
    return (
        <Button color={isDone ? "success":"error"}>
            {isDone? <p>{name} Task Complete</p>:<p> {name} Task Pending</p>}
        </Button>

    );
}