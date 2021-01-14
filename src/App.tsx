import React from 'react';
import { interval, fromEvent } from 'rxjs';
import { startWith, scan, share, buffer, debounceTime } from 'rxjs/operators';
import './App.css';

const App = () => {
	const [pause, setPause] = React.useState(true);
	const [currentTime, setTime] = React.useState(0);
	const waitButton = React.useRef(null);

  	let timer$ = interval(1000);

  	React.useEffect(() => {
    	let startCount$ = timer$.pipe(
        	startWith(currentTime),
        	scan(time => time + 1),
        	share(),
		)
		  
		let currentTimer$ = startCount$.subscribe(i => {
        	if (!pause) {
          		setTime(i);
        	}
      	});

    	return () => currentTimer$.unsubscribe();
  	}, [pause, currentTime, timer$]);

	React.useEffect(() => {
		const click$ = fromEvent(waitButton.current, 'dblclick');

		let dblclick$ = click$.pipe(
			buffer(click$.pipe(debounceTime(300))),
		);

		let sub = dblclick$.subscribe(() => {
			setPause(true)
		})

		return () => sub.unsubscribe();
	}, [])

	const handleStartStopReset = (pause, time = undefined) => {
		setPause(pause);
		
		if (time !== undefined) {
			setTime(time);
		}
	}

	const timeFormat = (time) => {
    	return new Date(time * 1000).toISOString().substr(11, 8);
  	};

  	return (
    	<div className="app">
      		<p>{timeFormat(currentTime)}</p>

			{pause ? 
				<button onClick={() => handleStartStopReset(false)}>Start</button> :
				<button onClick={() => handleStartStopReset(true, 0)}>Stop</button>
			}
			  <button ref={waitButton}>Wait</button>
			  <button onClick={() => handleStartStopReset(false, 0)}>Reset</button>
  		</div>
  	);
}

export default App;