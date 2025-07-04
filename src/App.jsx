import TaskComponent from './assets/components/TaskComponent';
import { Container } from '@mui/material';
import './App.css';

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <h2>Task List</h2>
      <TaskComponent />
    </Container>
  );
}

export default App;
