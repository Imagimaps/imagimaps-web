export default async (ctx: any) => {
  console.log(ctx);

  // const authLinksResponse = await fetch(
  //   `${authServiceBaseUrl}/api/auth/providers/`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       'x-source': 'bff-service',
  //     },
  //   },
  // );
  // if (!authLinksResponse.ok) {
  //   throw new Error('Failed to get auth links');
  // }
  // const tokenLinks = await authLinksResponse.json();
  // console.log(tokenLinks);
  // const tokenLink = tokenLinks[provider];

  // return {
  //   tokenLink,
  // };
};
