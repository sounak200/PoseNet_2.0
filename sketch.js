let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", function (results) {
    poses = results;
  });
}

function modelLoaded() {
  console.log("Model Loaded!");
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    // Draw keypoints
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }

    // Calculate shoulder and hip widths
    let leftShoulder = pose.keypoints[5].position;
    let rightShoulder = pose.keypoints[6].position;
    let leftHip = pose.keypoints[11].position;
    let rightHip = pose.keypoints[12].position;

    let shoulderWidth = dist(
      leftShoulder.x,
      leftShoulder.y,
      rightShoulder.x,
      rightShoulder.y
    );
    let hipWidth = dist(leftHip.x, leftHip.y, rightHip.x, rightHip.y);

    // Check posture and display
    let postureText;
    if (shoulderWidth < hipWidth) {
      postureText = "Slouching";
      fill(255, 0, 0);
    } else {
      postureText = "Good Posture";
      fill(0, 255, 0);
    }

    textSize(24);
    text(postureText, 10, 30);
  }
}
