workflow "CI" {
  on = "push"
  resolves = [
    "Check",
    "Test",
    "Build image",
  ]
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Check" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "check"
}

action "Test" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "test"
}

action "Build image" {
  uses = "actions/docker/cli@master"
  args = "build -t n6g7/httpdf:latest ."
}
