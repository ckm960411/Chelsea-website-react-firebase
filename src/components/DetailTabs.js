import Comment from "components/Comment"
import { useState } from "react";
import { Tabs } from "antd";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "styles/DetailTabs.scss";

const { TabPane } = Tabs;

function DetailTabs({ userObj, playerObj }) {
  const [season, setSeason] = useState(10);

  const handleChange = (event) => {
    setSeason(event.target.value);
  };

  return (
    <Tabs>
      <TabPane tab="Stats" key="1">
        <Box sx={{ width: 160 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={season}
              label="Season"
              onChange={handleChange}
            >
              <MenuItem value={10}>2021/2022</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <h1>Detail Stats</h1>
      </TabPane>
      <TabPane tab="Comment" key="2">
        <Comment userObj={userObj} playerObj={playerObj} />
      </TabPane>
      <TabPane tab="Photo" key="3">
        <h1>Photo</h1>
      </TabPane>
      <TabPane tab="Video" key="4">
        <h1>Youtuve Video</h1>
      </TabPane>
    </Tabs>
  );
}

export default DetailTabs;
