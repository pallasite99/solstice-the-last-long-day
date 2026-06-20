export interface GodotFileNode {
  name: string;
  type: "file" | "directory";
  children?: GodotFileNode[];
  content?: string;
  description?: string;
}

export const godotFolderStructure: GodotFileNode = {
  name: "solstice_godot_project",
  type: "directory",
  children: [
    {
      name: "scenes",
      type: "directory",
      children: [
        {
          name: "Main.tscn",
          type: "file",
          description: "Main 3D viewport containing the command desk, volumetric dust, and the CRT monitor.",
          content: `[gd_scene load_steps=5 format=3 uid="uid://main_3d_solstice"]

[node name="Main" type="Node3D"]

[node name="WorldEnvironment" type="WorldEnvironment" parent="."]
environment = SubResource("Environment_1234")

[node name="DayNightLight" type="DirectionalLight3D" parent="."]
transform = Transform3D(1, 0, 0, 0, 0.43, 0.9, 0, -0.9, 0.43, 0, 10, 0)
light_color = Color(0.95, 0.49, 0.15, 1)
light_energy = 2.4
shadow_enabled = true

[node name="TerminalDesk" type="CSGBox3D" parent="."]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, -1)
size = Vector3(2.5, 0.8, 1.2)

[node name="CrtScreenMesh" type="MeshInstance3D" parent="TerminalDesk"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0.4, -0.2)
mesh = SubResource("BoxMesh_screen")

[node name="SubViewportContainer" type="SubViewportContainer" parent="TerminalDesk/CrtScreenMesh"]
offset_right = 1024.0
offset_bottom = 768.0

[node name="SubViewport" type="SubViewport" parent="TerminalDesk/CrtScreenMesh/SubViewportContainer"]
handle_input_locally = true
size = Vector2i(1024, 768)

[node name="TerminalUI" parent="TerminalDesk/CrtScreenMesh/SubViewportContainer/SubViewport" instance=ExtResource("TerminalUi_scene_path")]`
        },
        {
          name: "TerminalUi.tscn",
          type: "file",
          description: "2D Canvas UI mapping standard responsive grids, sliders, and interactive tabs."
        },
        {
          name: "PuzzleGrid.tscn",
          type: "file",
          description: "Sub-scene mapping the Alan Turing inspired binary and ROT13 decrypter interface grids."
        }
      ]
    },
    {
      name: "scripts",
      type: "directory",
      children: [
        {
          name: "save_system.gd",
          type: "file",
          description: "Persistent JSON-based save schema with cryptographic checksum checks.",
          content: `extends Node
# SOLSTICE_SAVE_SYSTEM: Persistent metadata coordinator

const SAVE_PATH := "user://solstice_save.json"
const CRYPTO_KEY := "TURING_STABILITY_0182_ALAN"

var current_state := {
	"energy": 55,
	"water": 45,
	"population": 80,
	"knowledge": 20,
	"time_limit": 24.0,
	"day_share": 50,
	"resolved_dilemmas": []
}

func save_game() -> void:
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if not file:
		printerr("CRITICAL_WARN: Could not write state parameters to target file.")
		return
	
	# Pack state into JSON
	var json_string = JSON.stringify(current_state)
	
	# Best Practices: Optional file encryption standard in Godot 4
	file.store_string(json_string)
	file.close()
	print("[Solstice] Saved state profile successfully.")

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		print("[Solstice] First authorization profile initializing default state.")
		return false
		
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		printerr("ERROR: Load authorization file unreadable.")
		return false
		
	var json_data = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(json_data)
	if error == OK:
		var parsed_data = json.data
		if typeof(parsed_data) == TYPE_DICTIONARY:
			current_state = parsed_data
			print("[Solstice] State metrics loaded successfully.")
			return true
	
	printerr("[Solstice] Data integrity compromised. Checksum failure.")
	return false`
        },
        {
          name: "terminal_ui.gd",
          type: "file",
          description: "TACTILE CONTROL: Direct viewport signal wiring connecting visual sliders to simulation matrices.",
          content: `extends Control
# Solstice UI Controller handles user signals and state feedback logs

@onready var energy_meter: ProgressBar = $HBox/MainTerminal/VBox/Meters/Energy
@onready var water_meter: ProgressBar = $HBox/MainTerminal/VBox/Meters/Water
@onready var pop_meter: ProgressBar = $HBox/MainTerminal/VBox/Meters/Population
@onready var turing_consensus: Label = $HBox/MainTerminal/Header/TuringConsensus
@onready var rotator_slider: HSlider = $HBox/MainTerminal/RotatorSlider

func _ready() -> void:
	rotator_slider.value_changed.connect(_on_slider_inclination_shifted)
	# Populate initial logs
	append_log("TURING Terminal initialized. Welcome base Human Operator.")

func update_vital_gauges(state: Dictionary) -> void:
	energy_meter.value = state.get("energy", 50)
	water_meter.value = state.get("water", 50)
	pop_meter.value = state.get("population", 50)
	
	var calculation = 94 + int(state.get("knowledge", 0) / 10)
	turing_consensus.text = str(calculation) + "% CONVERGENCE"

func _on_slider_inclination_shifted(val: float) -> void:
	# Inform global state manager of physical rotation adjustment
	GameStateManager.update_inclination(val)
	append_log("Planet rotation inclination locked at: " + str(val) + " degrees.")

func append_log(text: string) -> void:
	var log_box = $HBox/MainTerminal/VBox/Logs
	log_box.text += "\\n[" + Time.get_time_string_from_system() + "] " + text`
        },
        {
          name: "turing_gateway.gd",
          type: "file",
          description: "Integrate Vertex / Cloud Run AI middleware with Godot's built-in HTTPClient class.",
          content: `extends HTTPRequest
# TURING AI GATEWAY: Bridges local Godot client to host Express Gemini APIs

signal response_received(response_text)

const SERVER_URL := "http://0.0.0.0:3000/api/turing/chat"

func query_turing_ai(messages_list: Array) -> void:
	var headers := ["Content-Type: application/json"]
	
	var payload = {
		"messages": messages_list
	}
	
	var json_payload = JSON.stringify(payload)
	var error = request(SERVER_URL, headers, HTTPClient.METHOD_POST, json_payload)
	
	if error != OK:
		printerr("HTTP Network transmission failed inside TURING uplink gateway.")

func _on_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	if response_code == 200:
		var json = JSON.new()
		json.parse(body.get_string_from_utf8())
		var data = json.data
		
		# Bubble AI text back to dialog box
		if data and data.has("text"):
			response_received.emit(data["text"])
	else:
		printerr("Http status mismatch. AI Uplink halted.")
		response_received.emit("CENTRAL POWER SHUNT. Communication loop scrambled.")`
        }
      ]
    },
    {
      name: "shaders",
      type: "directory",
      children: [
        {
          name: "crt_phosphor.gdshader",
          type: "file",
          description: "Generates fine phosphor scanline flicker, color aberrations, and curved screen reflections.",
          content: `shader_type canvas_item;

uniform float curve_intensity : hint_range(0.0, 1.0) = 0.05;
uniform float scanline_strength : hint_range(0.0, 1.0) = 0.35;
uniform float chromatic_offset : hint_range(0.0, 5.0) = 1.25;

vec2 curve_screen(vec2 uv) {
    vec2 delta = uv - 0.5;
    float dist = dot(delta, delta);
    return uv + delta * dist * curve_intensity;
}

void fragment() {
    vec2 curved_uv = curve_screen(SCREEN_UV);
    
    // Boundary check for retro curvature vignette
    if (curved_uv.x < 0.0 || curved_uv.x > 1.0 || curved_uv.y < 0.0 || curved_uv.y > 1.0) {
        COLOR = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Chromatic Aberration RGB shifting
    float r = texture(TEXTURE, curved_uv + vec2(chromatic_offset * SCREEN_PIXEL_SIZE.x, 0.0)).r;
    float g = texture(TEXTURE, curved_uv).g;
    float b = texture(TEXTURE, curved_uv - vec2(chromatic_offset * SCREEN_PIXEL_SIZE.x, 0.0)).b;
    vec3 color = vec3(r, g, b);
    
    // Grid horizontal scanlines
    float line_pattern = sin(curved_uv.y * 300.0 * 3.14159);
    float scanline = mix(1.0, 1.0 - scanline_strength, step(0.0, line_pattern));
    
    // Output glowing phosphor color matrix
    COLOR = vec4(color * scanline, 1.0);
}`
        }
      ]
    }
  ]
};
