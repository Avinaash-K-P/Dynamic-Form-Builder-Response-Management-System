import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import type { FormResponseSummary } from "../../services/dashboardService";

interface FormResponseTableProps {
  data: FormResponseSummary[];
}

const FormResponseTable = ({
  data,
}: FormResponseTableProps) => {
  return (
    <TableContainer
      component={Paper}
      className="form-response-table"
      elevation={0}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Form</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Responses</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length > 0 ? (
            data.map((form) => (
              <TableRow
                key={form.form_id}
                hover
              >
                <TableCell>
                  {form.form_title}
                </TableCell>

                <TableCell align="right">
                  {form.response_count}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
                align="center"
              >
                No form responses available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormResponseTable;
