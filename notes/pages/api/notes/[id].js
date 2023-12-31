// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { id } = req.query;
  const response = await (await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/notes/${id}`)).json()
  res.status(200).json({...response})
}
