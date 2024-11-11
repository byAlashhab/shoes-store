import { Helmet } from "react-helmet-async";

type MetadataProps = {
  title: string;
};

function Metadata({ title }: MetadataProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default Metadata;
