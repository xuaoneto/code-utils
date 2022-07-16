function Carrousel() {
  function scrollRight() {
    document.getElementById("scroll").scrollLeft += 500 + 32;
  }
  function scrollLeft() {
    document.getElementById("scroll").scrollLeft -= 500 + 32;
  }
  return (
    <Box
      width="100%"
      maxW="100vw"
      position="relative"
      as="section"
      pl={{ base: "10px", xl: "0" }}
      py={{ base: "10px", xl: "0" }}
    >
      <Flex
        overflowX="auto"
        w="100%"
        position="relative"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        id="scroll"
        scrollBehavior={"smooth"}
      >
        {cards ? (
          <Grid
            gridTemplateColumns={`repeat(${cards.length}, auto)`}
            gap={{ base: "15px", xl: "0" }}
          >
            {cards.map((item, index) => (
              <Card
                key={`card-slider-item-${index}`}
                title={item.title}
                src={item.src}
                link={item.link}
              />
            ))}
          </Grid>
        ) : null}
      </Flex>
      {!isMobile ? (
        <HStack
          width="100%"
          height="100%"
          position="absolute"
          top="0"
          left="0"
          justifyContent="space-between"
          p="0 24px"
          pointerEvents="none"
          zIndex="10"
        >
          <Button
            width="40px"
            height="40px"
            shapes="circle"
            pointerEvents="initial"
            onClick={scrollLeft}
          >
            <ArrowLeftIcon size={20} />
          </Button>
          <Button
            width="40px"
            height="40px"
            shapes="circle"
            pointerEvents="initial"
            onClick={scrollRight}
          >
            <ArrowRightIcon size={20} />
          </Button>
        </HStack>
      ) : null}
    </Box>
  );
}
