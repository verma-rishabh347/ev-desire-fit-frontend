import {
  useNavigate as useRouterNavigate,
  useParams as useRouterParams,
} from "react-router";
const useNavigate = () => {
  const navigate = useRouterNavigate();
  return (to, options) => {
    if (typeof to === "number") {
      navigate(to);
    } else {
      navigate(to, options);
    }
  };
};
const useParams = useRouterParams;
export { useNavigate, useParams };
