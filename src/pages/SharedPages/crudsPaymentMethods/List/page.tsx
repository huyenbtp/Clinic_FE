import { useEffect, useState } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import PaymentMethodsToolbar from "./PaymentMethodsToolbar";
import PaymentMethodsTable from "./PaymentMethodsTable";
import CreatePaymentMethod from "../Create/CreatePaymentMethod";
import AlertDialog from "../../../../components/AlertDialog";
import { showMessage } from "../../../../components/ActionResultMessage";
import { apiCall } from "../../../../api/api";
import { paymentMethodsSearch, paymentMethodsDelete } from "../../../../api/urls";

export default function PaymentMethodsList() {
  const [searchKey, setSearchKey] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);

  const fetchList = () => {
    const query = `?page=0&size=20${searchKey ? `&keyword=${encodeURIComponent(searchKey)}` : ""}`;
    apiCall(paymentMethodsSearch(query), "GET", null, null, (res: any) => {
      setData(res.data?.content || []);
    }, (err: any) => {
      console.error(err);
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '26px 50px', height: '100%', overflow: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mx={4} mb={3}>Payment Methods</Typography>

      <Box flex={1} p="6px">
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px 48px', gap: 1, borderRadius: 2 }}>
          <PaymentMethodsToolbar
            searchKey={searchKey}
            onChangeSearchKey={setSearchKey}
            onOpenCreate={() => setIsCreateOpen(true)}
            onRefresh={fetchList}
          />

          <Divider />

          <Box flex={1} mt={3}>
            <PaymentMethodsTable data={data} onDelete={handleDelete} onRefresh={fetchList} />
          </Box>
        </Card>
      </Box>

      <CreatePaymentMethod open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSaved={() => { showMessage("Saved"); setIsCreateOpen(false); fetchList(); }} />

      <AlertDialog
        title="Are you sure you want to delete this payment method?"
        type="error"
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        buttonCancel="Cancel"
        buttonConfirm="Delete"
        onConfirm={() => {
          if (!deleteId) return;
          apiCall(paymentMethodsDelete(deleteId), "DELETE", null, null, () => {
            showMessage("Deleted successfully");
            setIsDeleteOpen(false);
            setDeleteId(null);
            fetchList();
          }, (err: any) => {
            console.error(err);
          });
        }}
      />
    </Box>
  );
}
