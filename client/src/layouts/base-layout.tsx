import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="min-h-dvh w-full max-w-[100vw]">
      <Outlet />
    </div>
  );
};

export default BaseLayout;
