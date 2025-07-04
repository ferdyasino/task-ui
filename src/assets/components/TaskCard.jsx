import { Card, CardContent, Typography, Button } from "@mui/material";

export default function TaskCard({ task, toggle }){
    return (
        <Card sx={{ mb:2 }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography sx={{ mb: 1 }} color={task.done ? 'green':'red'}>
                    {task.done? 'Complete':'Pending'}
                </Typography>
                <Button 
                    onClick={()=>toggle(task.id)}
                    color={task.done ? 'success':'error'}
                    variant="outlined"
                >
                    {task.done ? 'Mark Done ':'Mark Incomplete'}
                </Button>
            </CardContent>
        </Card>
    );
}