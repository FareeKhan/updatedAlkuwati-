import React from "react";
import { useToast } from "react-native-toast-notifications";

const CustomToast = ({ text, type = "normal" }) => {
  const toast = useToast();

  React.useEffect(() => {
    if (toast) {
      toast.show(text, {
        type,
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
    }
  }, [text, type, toast]);

  return null;
};

export default CustomToast;



// const CustomToast = ()=>{
  
// }

