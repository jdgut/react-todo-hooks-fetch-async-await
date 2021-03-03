import React, { useState, useEffect, useRef } from "react";

/** Bootstraps Components */
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const ToDoList = props => {
	const endpoint = `https://assets.breatheco.de/apis/fake/todos/user/jdgutierrez`;
	const [todos, setTodos] = useState([]);
	const [alertBox, setAlertBox] = useState();

	//const initialMount = useRef(true);

	useEffect(() => {
		loadInitialTodos();
		//initialMount.current = false;
	}, []);

	useEffect(() => {
		//if (initialMount.current) initialMount.current = false;
		if (todos.length > 0) queryApi("PUT", todos);
	}, [todos]);

	const checkResponseType = response => "ok" in response && !response.ok;

	const loadInitialTodos = async () => {
		let apiResponse = await queryApi();

		if (checkResponseType(apiResponse) === true) {
			apiResponse = await queryApi("POST", []);
			if ("result" in apiResponse) {
				apiResponse = await queryApi();
			} else {
				setTodos([]);
				throw new Error("Unable to create list");
			}
		}
		setTodos(apiResponse);
	};

	const queryApi = async (method = "GET", data = []) => {
		const options = {
			headers: {
				"Content-type": "application/json"
			},
			method,
			body: JSON.stringify(data)
		};

		const response =
			method === "GET"
				? await fetch(endpoint)
				: await fetch(endpoint, options);
		try {
			if (response.ok) {
				const resultSet = await response.json();
				return resultSet;
			} else {
				return response;
			}
		} catch (error) {
			throw new Error(error);
		}
	};

	const addTask = e => {
		if (e.keyCode === 13) {
			const task = e.target.value.trim();
			const newTodos = [...todos, { label: task, done: false }];
			e.target.value = "";
			setTodos(newTodos);
		}
	};

	const deleteTask = i => {
		if (todos.length === 1) deleteList();
		else {
			const newTodos = todos.filter((task, idx) => idx !== i);
			setTodos(newTodos);
		}
	};

	const deleteList = async e => {
		const apiResponse = await queryApi("DELETE");
		const alertDivs =
			"result" in apiResponse ? (
				<div className="alert alert-success" role="alert">
					List Deleted.
					<br /> Please refresh page to recreate list
				</div>
			) : (
				<div className="alert alert-success" role="alert">
					List Deleted.
					<br /> Please refresh page to recreate list
				</div>
			);

		setTodos([]);
		setAlertBox(alertDivs);
	};

	return (
		<>
			<Container>
				<h1>todos</h1>

				{alertBox}

				{todos.length > 0 && (
					<Card style={{ width: "100%" }}>
						<Card.Body>
							<ListGroup as="ul" variant="flush">
								<ListGroup.Item as="li">
									<input
										type="text"
										placeholder="What needs to be done?"
										width="100%"
										onKeyDown={addTask}
									/>
								</ListGroup.Item>
								{todos.map((task, idx) => (
									<ListGroup.Item as="li" key={idx}>
										{task.label}
										<button
											className="remove-task"
											onClick={() => deleteTask(idx)}>
											X
										</button>
									</ListGroup.Item>
								))}
							</ListGroup>
							<footer className="footer border-top">
								{todos.length}{" "}
								{todos.length === 1 ? `item` : `items`} left
							</footer>
							<div className="d-flex justify-content-center">
								<button
									className="btn btn-danger"
									onClick={deleteList}>
									DELETE LIST
								</button>
							</div>
						</Card.Body>
					</Card>
				)}
			</Container>
		</>
	);
};

export { ToDoList as default };
