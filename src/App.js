import React , {Fragment} from 'react';
import { Routes,Route} from 'react-router-dom';
import Home from './components/Home.js';
import QuizInstructions from './components/quiz/QuizInstructions.js';
import Play from './components/quiz/Play.js';
// import QuizInstructions from './components/quiz/QuizInstructions.js';
import QuizSummary from './components/quiz/QuizSummary.js';

function App() {
  return (
       <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/play/instructions' element={<QuizInstructions/>}/>
       <Route path='/play/quiz' element={<Play/>}/>
       <Route path='/play/quizSummary' element={<QuizSummary/>}/>
      </Routes>
     
  );
}

export default App;
