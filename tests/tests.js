describe("PowerJS Test Suite", function() {

    describe("Testing module method ",function(){

        it("should have module method", function() {
            expect(module).toBeDefined();
            expect(typeof  module()).toBe("object");
        });


        describe("should except Zero parameters and",function(){

            it("should work with no parameters",function(){
                expect(typeof module()).toBe("object");
            });
            it("should work with undefined in parameters",function(){
                expect(typeof module(undefined,undefined)).toBe("object");
            });
        });

        describe("should except One parameters of type string and",function(){

            it("should work with Strings",function(){
                expect(typeof module("positive")).toBe("object");
                expect(module("positive")).toBeDefined();

                expect(typeof module("positive.working")).toBe("object");
                expect(module("positive.working")).toBeDefined();
            });

            it("should not work with numbers like 1 ",function(){
                expect(function(){
                    module(1);
                }).toThrow((new Error("Expected String Type.")));
            });

            it("should not work with numbers like 0",function(){
                expect(function(){
                    module(0);
                }).toThrow((new Error("Expected String Type.")));
            });
            it("should not work with numbers like -1",function(){
                expect(function(){
                    module(-1);
                }).toThrow((new Error("Expected String Type.")));
            });

            it("should not work with Objects",function(){
                expect(function(){
                    module({});
                }).toThrow((new Error("Expected String Type.")));

                expect(function(){
                    debugger;
                    module(null);
                }).toThrow((new Error("Expected String Type.")));
            });

        });

        describe("It should except two parameters, first of type string and second should be JSModule",function(){

            it("should accept JSModule Only as second parameter",function(){
                var testModule = module("testModule");
                expect(typeof module("positive.working",testModule)).toBe("object");
                expect(typeof testModule.positive.working).toBe("object");
                expect(testModule.positive.working).toBeDefined();
                expect(testModule.positive.working instanceof JSModule).toBeTruthy();
            });

            it("should not accepts an object.",function(){
                expect(function(){
                    module("negative",{});
                }).toThrow(new Error("Expected instanceof JSModule."));

                expect(function(){
                    module("negative",null);
                }).toThrow(new Error("Expected instanceof JSModule."));

            });

            it("should not accepts a number",function(){
                expect(function(){
                    module("negative",-1);
                }).toThrow(new Error("Expected instanceof JSModule."));

                expect(function(){
                    module("negative",0);
                }).toThrow(new Error("Expected instanceof JSModule."));

                expect(function(){
                    module("negative",1);
                }).toThrow(new Error("Expected instanceof JSModule."));
            });
        });

        describe("Checking namespace construction",function(){

            var subChild = module("parent.child.subChild");
            var parent = module("parent");

            it("should create nested modules",function(){
                expect(parent).toBeDefined();
                expect(parent.child).toBeDefined();
                expect(parent.child.subChild).toBeDefined();
            });

            it("should create a anonymous module",function(){
                expect(module()).toBeDefined();
                expect(typeof module()).toBe("object");
            });

            it("should have parent module",function(){
                expect(parent).toBeDefined();
            });

            it("should have a child module",function(){
                expect(parent.child).toBeDefined();
            });

            it("should have a subChild module",function(){
                expect(parent.child.subChild).toBeDefined();
            });

        });


        describe("testing module method contents",function(){
            it("should have $Class", function() {
                expect(module().$Class).toBeDefined();
            });

            it("should have $Injectable", function() {
                expect(module().$Injectable).toBeDefined();
            });
        });



    });



});

