export const HomeFooter = () => {
  return (
    <footer>
      <div className="mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-right">
            Copyright &copy; {new Date().getFullYear()}. All rights reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};
