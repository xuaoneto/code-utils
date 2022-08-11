import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ResponsiveTitle } from "components/ResponsiveTitles";
import { RightSideMenu } from "components/ServicesPage/NavServices/right-side-menu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "services/api";
import Cookies from "universal-cookie";

export function SideBlogItems({ posts }) {
  const router = useRouter();
  const cookies = new Cookies();
  const [tags, renderTag] = useState();
  const [deleteMode, setDeleteMode] = useState(false);
  const [inputAddTag, setInputAddTag] = useState("");

  function addTag(tag) {
    const arrayTags = cookies.get("blogTags");

    if (arrayTags) {
      const addTag = [...arrayTags, tag];
      cookies.set("blogTags", addTag, { path: "/blog" });
      renderTag(cookies.get("blogTags"));
    } else {
      const initialArrayTags = [tag];
      const stringfyArray = JSON.stringify(initialArrayTags);
      cookies.set("blogTags", stringfyArray, { path: "/blog" });
      renderTag(cookies.get("blogTags"));
    }
  }

  function deleteTag(tag) {
    const arrayTags = cookies.get("blogTags");
    if (arrayTags) {
      let copy = [...arrayTags];
      copy = copy.filter((current, index, self) => {
        return current != tag;
      });
      cookies.set("blogTags", copy, { path: "/blog" });
      renderTag(cookies.get("blogTags"));
    }
  }

  const routerblog =
    router.pathname === "/blog" || /\/blog\/category\//.test(router.pathname);
  const [categorys, setCategorys] = useState();

  useEffect(() => {
    api.get("blog-posts?_sort=slugCategory:desc&_limit=-1").then((posts) => {
      let uniqueArray = [];
      posts.data.map((item, pos, self) => {
        const model = {
          category: item.category,
          link: `/blog/category/${item.slugCategory}`,
        };
        const slicedArray = self.slice(pos + 1, self.length);

        const repeated = slicedArray.find((current) => {
          return current.slugCategory === item.slugCategory;
        });

        if (!repeated) {
          uniqueArray.push(model);
        }
      });

      setCategorys(uniqueArray);
    });
    api.get("tags").then((response) => {
      renderTag(response.data);
    });
  }, []);

  const showposts = routerblog ? null : posts?.slice(0, 5);

  return (
    <Box
      display={{ base: "block", lg: "grid", xl: "block" }}
      gridTemplateColumns={{ base: "none", lg: "1fr 1fr", xl: "none" }}
      gridGap={{ base: "0", lg: "40px", xl: "0" }}
    >
      <Stack alignItems="start">
        <ResponsiveTitle color="primary.500" mb="30px">
          {routerblog ? "Featured Categories" : "Featured Posts"}
        </ResponsiveTitle>
        <Stack w="100%">
          {routerblog ? (
            <>
              {categorys
                ? categorys.map((item, index) => {
                    return (
                      <RightSideMenu
                        key={`DUIDefense-${index}`}
                        title={item.category}
                        link={item.link}
                      />
                    );
                  })
                : null}
            </>
          ) : (
            <>
              {showposts
                ? showposts.map((item, index) => {
                    return (
                      <Link
                        href={`/blog/post/${item.slug}`}
                        _hover={{ boxShadow: "0 0 1em rgba(0,0,0, 0.2)" }}
                        boxShadow="0 0 1em rgba(0,0,0, 0.1)"
                        transition="box-shadow .3s"
                        key={`postCard-${index}`}
                      >
                        <Grid templateColumns="0.4fr 0.6fr" bg="white" w="100%">
                          <Box
                            w="100%"
                            h="100%"
                            bgImage={`${process.env.NEXT_PUBLIC_APP_API_URL}${item.image[0].url}`}
                            bgSize="cover"
                            bgPos="center"
                          />
                          <Flex w="100%" p="25px 20px">
                            <Box>
                              <Text color="secondary.500" mb="5px">
                                {item.category}
                              </Text>
                              <Text color="primary.500">{item.title}</Text>
                            </Box>
                          </Flex>
                        </Grid>
                      </Link>
                    );
                  })
                : null}
            </>
          )}
        </Stack>
      </Stack>
      {tags ? (
        tags.length === 0 ? null : (
          <Stack alignItems="start" pb="80px">
            <ResponsiveTitle
              mt={{ base: "30px", lg: "0", xl: "30px" }}
              mb="30px"
            >
              All Tags
            </ResponsiveTitle>
            <Stack alignItems="start" justifyContent="center" flexWrap="wrap">
              <Flex alignItems="start" flexWrap="wrap">
                {tags.map((tag, index) => {
                  const url = window.location.pathname.split("/");
                  const active =
                    tag === url[url.length - 2] &&
                    url[url.length - 3] === "tag";

                  return (
                    <Box key={`Tag-${index}`} p="5px 5px 0 0">
                      <Link
                        display="flex"
                        p="17px 20px"
                        color="white"
                        href={`/blog/tag/${tag.slug}`}
                        _hover={{ bg: "secondary.500" }}
                        bg={active ? "secondary.500" : "primary.500"}
                        onClick={
                          deleteMode
                            ? () => {
                                deleteTag(tag);
                                setTimeout(() => {
                                  setDeleteMode(false);
                                }, 50);
                              }
                            : null
                        }
                      >
                        {tag.tagName}
                      </Link>
                    </Box>
                  );
                })}
                <Box p="4px 5px 0 0">
                  {" "}
                  <Menu>
                    {({ isOpen, onOpen, onClose }) => (
                      <>
                        <MenuButton
                          as={IconButton}
                          icon={<HamburgerIcon />}
                          p="29px 19px"
                          borderRadius="0"
                          color="primary.500"
                          _focus={{}}
                          aria-label="Options"
                          variant="outline"
                          display="flex"
                          alignItems="center"
                          textAlign="center"
                          _active={{ bg: "secondary.500", color: "white" }}
                          _hover={{ bg: "secondary.500", color: "white" }}
                        >
                          +
                        </MenuButton>
                        <MenuList px="8px">
                          <HStack>
                            <Input
                              _focus={{}}
                              value={inputAddTag}
                              onChange={(e) => setInputAddTag(e.target.value)}
                            />{" "}
                            <Button
                              borderRadius="0"
                              bg="primary.500"
                              color="white"
                              _hover={{ bg: "secondary.500" }}
                              onClick={() => {
                                addTag(inputAddTag);
                                setInputAddTag("");
                                onClose();
                              }}
                            >
                              Add
                            </Button>
                          </HStack>
                          <Button
                            borderRadius="0"
                            w="100%"
                            mt="8px"
                            bg={tags ? "#f00" : "#aaa"}
                            color="white"
                            _hover={{ bg: "#a00" }}
                            onClick={() => {
                              setDeleteMode((state) => !state);
                            }}
                          >
                            Delete Tag
                          </Button>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </Box>
              </Flex>
            </Stack>
          </Stack>
        )
      ) : null}
    </Box>
  );
}
