function get(obj, path, defValue = false) {
  return (
    path.split(".").reduce((acc, part) => acc && acc[part], obj) || defValue
  );
}

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const id = "269650371";

function filterOwner(array) {
  return array.filter(item => {
    const ownerId = get(item, "node.owner.id", "");
    return ownerId === id;
  });
}

function deriveSrc(array) {
  return array
    .map(({ node }) => ({
      url: node.shortcode,
      src: get(node, "thumbnail_resources.0.src")
    }))
    .filter(Boolean);
}

function sortByDate(array) {
  return array.sort(
    (a, b) =>
      get(b, "node.taken_at_timestamp") - get(a, "node.taken_at_timestamp")
  );
}

function size(array) {
  return array.slice(0, 12);
}

function render(items, parent) {
  const ul = document.createElement("ul");
  items.forEach(({ src, url }, i) => {
    const li = document.createElement("li");
    li.className = "feed_item";
    li.innerHTML = `<a href="https://www.instagram.com/p/${url}/"><img class="feed_img" src="${src}" alt="${i}"/></a>`;
    ul.appendChild(li);
  });
  parent.appendChild(ul);
}

const first = 20;

const feed = document.getElementById("feed");

const src = `https://www.instagram.com/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=%7B%22tag_name%22%3A%22subbotinatattoo%22%2C%22first%22%3A12%2C%22after%22%3A%22QVFCSXpvSFhSNnJQeHJ6WHRyOXpIUVZOdDljdUE0U1V0cloybFR4bnozR29zakZnTlh5R2xhM0dzaEVOUmVYekVCSXRHSlBMY2dha1Fwbl9RR3d5WkFXNQ%3D%3D%22%7D`;

fetch(src)
  .then(res => {
    if (res.status !== 200) {
      console.error(res);
      return;
    }
    res
      .json()
      .then(({ data }) => {
        const images = get(data, "hashtag.edge_hashtag_to_media.edges", []);
        const getList = pipe(
          filterOwner,
          sortByDate,
          deriveSrc,
          size
        );

        const list = getList(images);
        if (list.length) {
          render(list, feed);
        }
      })
      .catch(console.error);
  })
  .catch(console.error);
