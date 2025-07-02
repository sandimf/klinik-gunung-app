import { Button } from "@/Components/ui/button"

const ButtonBack = () => {
  return (
    <Button
    onClick={() => window.history.back()}
    className=""
  >
    &larr; Kembali
  </Button>
  );
};

export default ButtonBack;
