import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ArrowDown } from "lucide-react";
import DragDrop from "../DragDrop/DragDrop";

const AccordionUpload: React.FC = () => {
	return (
		<div>
			<Accordion>
				<AccordionSummary
					expandIcon={<ArrowDown />}
					aria-controls="panel1-content"
					id="panel1-header"
				>
					<Typography component="span">File Upload</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<DragDrop />
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default AccordionUpload;
