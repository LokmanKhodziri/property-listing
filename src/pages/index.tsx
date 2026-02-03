import axios from 'axios';

export async function getServerSideProps() {
  try {
    const response = await axios.post(
      'https://agents.propertygenie.com.my/api/properties-mock',
      {
        categories: [],
        types: [],
      },
      {
        params: {
          page: 1,
          sort: '-createdAt',
        },
      }
    );

    return {
      props: {
        properties: response.data?.data || [],
        pagination: response.data?.meta || null,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        properties: [],
        error: true,
      },
    };
  }
}

export default function Home({ properties, error }) {
  if (error) {
    return <div>Failed to load properties</div>;
  }

  return (
    <div>
      <h1>Property Listings</h1>
      <pre>{JSON.stringify(properties[0], null, 2)}</pre>
    </div>
  );
}
