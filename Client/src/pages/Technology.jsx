import CommonForm from "./commonForm";

const Technology = () => {
  return (
    <div>
      <CommonForm
        formArray={[
          {
            type: "text",
            name: "name",
            required: true,
            placeholder: "technology name",
            label: "Technology name",
          },
        ]}
        formName={"technology"}
      />
    </div>
  );
};

export default Technology;
