import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AccordionUpload from "./components/Accordion/Accordion";
import Table from "./components/Table/AgGridTable";

const App: React.FC = () => {
	return (
		<div className="App">
			<Toaster />
			{/* <AccordionUsage /> */}
			<AccordionUpload />

			<Table></Table>
		</div>
	);
};

export default App;
